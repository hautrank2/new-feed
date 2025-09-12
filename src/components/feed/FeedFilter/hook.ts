"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FeedFilterValues, FilterSchema } from "./type";
import { useMediaQuery } from "~/hooks/use-media-query";
import { useFeedCtx } from "../context";

// --------- Utils ---------
export function toLocalInput(d?: Date) {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

// --------- Hook cho Filter UI ---------
export function useFeedFilter() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { onFilter, users } = useFeedCtx();
  const form = useForm<FeedFilterValues>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [open, setOpen] = useState(false);

  const submit = (v: FeedFilterValues) => {
    onFilter(v);
    setOpen(false);
  };

  const resetForm = () => {
    form.reset({
      from: undefined,
      to: undefined,
      title: "",
      description: "",
      createdBy: "",
    });
  };

  return {
    form,
    open,
    setOpen,
    submit,
    resetForm,
    isDesktop,
    users,
  };
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function useIsDesktop(query = "(min-width: 768px)") {
  const [val, setVal] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setVal(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return val; // null cho tới khi mount
}
