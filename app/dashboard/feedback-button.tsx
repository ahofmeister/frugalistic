"use client";

import { MessageSquarePlus } from "lucide-react";
import React, { useState } from "react";

import { addFeedback } from "@/components/feedback/feedback-actions";
import LoadingSpinner from "@/components/loading/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useSidebar();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await addFeedback(feedback);
      if (response) {
        setFeedback("");
      } else {
        setError("Failed to send feedback. Please try again.");
      }
    } catch (error) {
      setError("Failed to send feedback. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton asChild tooltip="Feedback">
          {state === "expanded" ? (
            <Button variant="outline">
              <div className="flex">Feedback</div>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <MessageSquarePlus />
            </Button>
          )}
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row justify-between items-start">
          <DialogTitle className="text-xl">
            We appreciate your feedback!
          </DialogTitle>
        </DialogHeader>
        <Textarea
          className="min-h-[100px] resize-none"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        {error && (
          <Alert variant="default">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !feedback.trim()}
          >
            {isSubmitting ? <LoadingSpinner /> : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
