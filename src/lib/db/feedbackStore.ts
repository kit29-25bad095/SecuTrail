export interface StoredFeedback {
  id: string;
  resourceId: string;
  feedbackType: string;
  comments?: string;
  createdAt: string;
  status: "PENDING_REVIEW" | "RESOLVED" | "DISMISSED";
}

// In-memory feedback queue
const feedbackQueue: StoredFeedback[] = [
  {
    id: "fb_seed_001",
    resourceId: "res-dl-osc-aiims",
    feedbackType: "SECONDARY_LINE_BUSY",
    comments: "Direct casualty answered immediately, but secondary desk took several rings.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "PENDING_REVIEW",
  },
];

export function getFeedbackQueue(): StoredFeedback[] {
  return feedbackQueue;
}

export function addFeedback(feedback: Omit<StoredFeedback, "id" | "createdAt" | "status">): StoredFeedback {
  const item: StoredFeedback = {
    ...feedback,
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: "PENDING_REVIEW",
  };
  feedbackQueue.unshift(item);
  return item;
}
