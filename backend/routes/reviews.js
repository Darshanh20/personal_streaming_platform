import express from "express";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();
const prisma = new PrismaClient();

// ========== PUBLIC ROUTES (mounted at /api/reviews) ==========

// POST / - Create a new review (anonymous)
router.post("/", async (req, res) => {
  try {
    const { name, comment } = req.body;

    // Validation
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    if (comment.length > 300) {
      return res
        .status(400)
        .json({ error: "Comment must be 300 characters or less" });
    }

    const review = await prisma.review.create({
      data: {
        name: name ? name.trim() : "Anonymous",
        comment: comment.trim(),
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// GET /approved - Get all approved reviews
router.get("/approved", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ========== ADMIN ROUTES (mounted at /api/admin/reviews) ==========

// GET / - Get all reviews (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// PUT /:id/approve - Approve a review (admin only)
router.put("/:id/approve", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: { approved: true },
    });

    res.json(review);
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ error: "Failed to approve review" });
  }
});

// PUT /:id/reject - Reject/unapprove a review (admin only)
router.put("/:id/reject", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: { approved: false },
    });

    res.json(review);
  } catch (error) {
    console.error("Error rejecting review:", error);
    res.status(500).json({ error: "Failed to reject review" });
  }
});

// DELETE /:id - Delete a review (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id },
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
