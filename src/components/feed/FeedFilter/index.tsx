"use client";

import { Filter, X, CalendarIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "~/components/ui/drawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import { useFeedFilter, useIsDesktop, useMounted } from "./hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { formatDate } from "~/utils/datetime";
import { Calendar } from "~/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Typography } from "~/components/ui/typography";
import { ClearIconButton } from "./BtnClear";
import { Textarea } from "~/components/ui/textarea";

export function FeedFilter() {
  const { form, open, setOpen, submit, resetForm, users } = useFeedFilter();
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const Body = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-3 p-4">
        {/* Date range */}
        <div className="grid gap-3">
          <FormLabel className="text-sm font-semibold">Posted at</FormLabel>
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <ClearIconButton
                      title="Clear from"
                      onClick={() => field.onChange(undefined)}
                      disabled={!field.value}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <ClearIconButton
                      title="Clear to"
                      onClick={() => field.onChange(undefined)}
                      disabled={!field.value}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* createdBy (multi-select) */}
        <FormField
          control={form.control}
          name="createdBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Created By</FormLabel>
              <div className="flex items-center gap-2">
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full h-auto! text-left">
                      <SelectValue placeholder="User" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Optional: mục "Any" để clear ngay trong menu */}
                    <SelectItem
                      value="__any__"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(undefined);
                        }}
                      >
                        Any
                      </div>
                    </SelectItem>

                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={u.image} alt={u.name} />
                            <AvatarFallback>
                              {u.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Typography variant="p" className="font-semibold">
                              {u.name}
                            </Typography>
                            <Typography variant="p">{u.email}</Typography>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ClearIconButton
                  title="Clear user"
                  onClick={() => field.onChange(undefined)}
                  disabled={!field.value}
                />
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Search title…" {...field} />
                </FormControl>
                <ClearIconButton
                  title="Clear title"
                  onClick={() => field.onChange("")}
                  disabled={!field.value}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Textarea placeholder="Search description…" {...field} />
                </FormControl>
                <ClearIconButton
                  title="Clear description"
                  onClick={() => field.onChange("")}
                  disabled={!field.value}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" className="flex-1">
            <Filter className="mr-2 h-4 w-4" /> Apply
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );

  if (!mounted || isDesktop == null) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed right-3 bottom-3 z-40 rounded-full shadow-md"
            size="icon"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="filter dialog"
        >
          <DialogHeader>
            <DialogTitle>File</DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="fixed right-3 bottom-3 z-40 rounded-full shadow-md"
          size="icon"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between flex-row">
          <DrawerTitle>Filter</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="overflow-y-auto">{Body}</div>
      </DrawerContent>
    </Drawer>
  );
}
