"use client";

import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
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
            className="bg-[#E85C33] hover:bg-[#E85C33]/90 text-base px-8"
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
