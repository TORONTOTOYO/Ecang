import { test } from "node:test";
import { strict as assert } from "node:assert";
import { formatDuration, getProjectCover, isCloudinaryVideoUrl } from "./reel.js";

test("accepts only HTTPS Cloudinary video upload delivery URLs", () => {
  assert.equal(isCloudinaryVideoUrl("https://res.cloudinary.com/demo/video/upload/v123/reel.mp4"), true);
  for (const url of [
    "",
    "https://facebook.com/video",
    "http://res.cloudinary.com/demo/video/upload/reel.mp4",
    "https://res.cloudinary.com.example.com/demo/video/upload/reel.mp4",
    "https://res.cloudinary.com/demo/image/upload/photo.jpg",
    "https://res.cloudinary.com/demo/video/upload/",
    "https://user@res.cloudinary.com/demo/video/upload/reel.mp4",
  ]) assert.equal(isCloudinaryVideoUrl(url), false, url);
});

test("uses a project cover or derives the first video frame when no cover is set", () => {
  const reelUrl = "https://res.cloudinary.com/demo/video/upload/v123/folder/reel.mp4?token=123";
  assert.equal(getProjectCover({ cover: "https://example.com/cover.jpg", reelUrl }), "https://example.com/cover.jpg");
  assert.equal(getProjectCover({ cover: "", reelUrl }), "https://res.cloudinary.com/demo/video/upload/so_0/v123/folder/reel.jpg?token=123");
  assert.equal(getProjectCover({ reelUrl: "https://res.cloudinary.com/demo/video/upload/folder/reel" }), "https://res.cloudinary.com/demo/video/upload/so_0/folder/reel.jpg");
  assert.equal(getProjectCover({ reelUrl: "https://example.com/reel.mp4" }), "");
  assert.equal(getProjectCover({}), "");
});

test("formats actual video duration in minutes or hours", () => {
  assert.equal(formatDuration(0), "0:00");
  assert.equal(formatDuration(108.9), "1:48");
  assert.equal(formatDuration(3661), "1:01:01");
  assert.equal(formatDuration(Infinity), "");
  assert.equal(formatDuration(NaN), "");
});
