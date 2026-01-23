/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

type ZodIssue = {
  path: (string | number)[];
  message: string;
  code?: string;
};

export function extractZodIssues(error: unknown): ZodIssue[] | null {
  if (!error || typeof error !== "object") return null;

  const err = error as any;

  if (Array.isArray(err.issues)) return err.issues;
  if (Array.isArray(err.errors)) return err.errors;

  if (typeof err.message === "string") {
    try {
      const parsed = JSON.parse(err.message);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  return null;
}

export type ActionError = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string>;
};

export function parseActionError(error: any): ActionError {
  // ---- ZOD ----
  const zodIssues = extractZodIssues(error);
  if (zodIssues) {
    return {
      success: false,
      message: zodIssues[0]?.message ?? "Invalid input",
      fieldErrors: zodIssues.reduce(
        (acc, issue) => {
          const key = issue.path[0];
          if (typeof key === "string") {
            acc[key] = issue.message;
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  }

  // ---- PRISMA ----
  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    "code" in error &&
    (error as any).name === "PrismaClientKnownRequestError"
  ) {
    const prismaError = error as PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      const fields = Array.isArray(prismaError.meta?.target)
        ? prismaError.meta?.target.join(", ")
        : "Field";

      return {
        success: false,
        message: `${fields} already exists.`,
        fieldErrors: Array.isArray(prismaError.meta?.target)
          ? Object.fromEntries(
              prismaError.meta!.target.map((f: string) => [
                f,
                "Already exists",
              ]),
            )
          : undefined,
      };
    }

    if (prismaError.code === "P2025") {
      return {
        success: false,
        message: "Record not found.",
      };
    }
  }

  // ---- FALLBACK ----
  return {
    success: false,
    message:
      typeof error.message === "string"
        ? error.message
        : JSON.stringify(error.message),
  };
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is neither a number nor string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format the date and time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions,
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true },
  );
}
