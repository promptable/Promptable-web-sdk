import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import axios from "axios";
import { unescapeStopTokens } from "./utils";

export interface CompletionRequest {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
  stop: string | string[] | null;
}

export interface StreamCompletionArgs {
  req: CompletionRequest; // openai req
  apiKey: string;
  onMessage: (payload: any) => void;
  onClose?: () => void;
  onError?: (err: any) => void;
}

export interface RunCompletionArgs {
  req: CompletionRequest; // openai req
  apiKey: string;
}
export const runCompletion = async ({ req, apiKey }: RunCompletionArgs) => {
  if (req.stop != null) {
    console.log("Stop tokens", req.stop);
    console.log("Unescaped stop tokens", unescapeStopTokens(req.stop));
    req.stop = unescapeStopTokens(req.stop);
  }

  const prompt = req.prompt;

  const res = await axios.get("https://openai.com/v1/completions", {
    data: {
      prompt,
      config: {
        ...req,
        prompt: undefined,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return res.data;
};

/**
 * Opens a stream to OpenAI's completion endpoint.
 *
 * @param args StreamCompletionArgs
 */
export const openCompletionStream = ({
  onClose,
  onMessage,
  onError,
  req,
  apiKey,
}: StreamCompletionArgs) => {
  const ctrl = new AbortController();

  const closeStream = () => {
    ctrl.abort();

    onClose?.();
  };

  if (req.stop != null) {
    console.log("Stop tokens", req.stop);
    console.log("Unescaped stop tokens", unescapeStopTokens(req.stop));
    req.stop = unescapeStopTokens(req.stop);
  }

  fetchEventSource("https://api.openai.com/v1/completions", {
    async onopen(response) {
      console.log("onopen", response);
      if (
        response.ok &&
        response.headers.get("content-type") === EventStreamContentType
      ) {
        return; // everything's good
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        // client-side errors are usually non-retriable:
        console.error("Failed to open stream to OpenAI API", response);
      } else {
        console.log("Failed to open stream to OpenAI API", response);
      }
      throw new Error(
        response.status === 401
          ? "Error please enter a valid API key."
          : "Unknown error, please try again."
      );
    },
    onmessage(msg) {
      if (msg.data === "[DONE]") {
        closeStream();
        return;
      }
      // Assuming we receive JSON-encoded data payloads:
      const payload = JSON.parse(msg.data);
      const completion = payload.choices?.[0];

      if (completion?.finish_reason === "stop") {
        closeStream();
        return;
      }

      onMessage(payload);
    },
    onclose() {
      console.log("onclose");
      closeStream();
      // if the server closes the connection unexpectedly, retry:
      // throw new RetriableError();
    },
    onerror(err) {
      console.log("onerror", err);
      console.log("OAI stream closed due to error", JSON.stringify(err));
      closeStream();
      onError?.(err.message);
      throw err; // rethrow to stop the operation
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    method: "POST",
    body: JSON.stringify({
      ...req,
      stop: req.stop?.length ? req.stop : null,
      stream: true,
    }),
    openWhenHidden: true,
    signal: ctrl.signal,
  }).catch((e) => {
    console.error("Completions error: Error fetching event source", e);
    closeStream();
  });
};
