// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FaDev } from "react-icons/fa6";
import BlogCard from "../components/homepage/blog/blog-card";

async function getBlogs() {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching Dev.to blogs:", error);
    return [];
  }
};

async function page() {
  const blogs = await getBlogs();
  const devProfileUrl = personalData.devto || `https://dev.to/${personalData.devUsername}`;

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {(!blogs || blogs.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#11152c] rounded-lg border border-[#1f223c] max-w-xl mx-auto my-6 text-white">
          <FaDev className="text-[#16f2b3] mb-3" size={48} />
          <p className="text-gray-300 text-base mb-4">
            Follow all my technical articles, tutorials, and developer stories directly on DEV Community.
          </p>
          <Link
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-center text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:opacity-90 md:font-semibold"
            role="button"
            target="_blank"
            rel="noopener noreferrer"
            href={devProfileUrl}
          >
            <span>Read my articles</span>
            <FaArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
          {blogs.map((blog, i) => (
            blog?.cover_image && <BlogCard blog={blog} key={i} priority={i < 3} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link
          className="flex items-center gap-2 rounded-full border border-[#16f2b3] bg-[#0d1224] px-6 py-3 text-center text-sm font-medium uppercase tracking-wider text-[#16f2b3] no-underline transition-all duration-200 ease-out hover:bg-[#16f2b3] hover:text-[#0d1224] md:font-semibold"
          role="button"
          target="_blank"
          rel="noopener noreferrer"
          href={devProfileUrl}
        >
          <FaDev size={20} />
          <span>Read my articles on DEV.to</span>
        </Link>
      </div>
    </div>
  );
};

export default page;
