// @flow strict
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { FaDev } from 'react-icons/fa6';
import { personalData } from '@/utils/data/personal-data';
import BlogCard from './blog-card';

function Blog({ blogs }) {
  const devProfileUrl = personalData.devto || `https://dev.to/${personalData.devUsername}`;

  return (
    <div id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl  opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Blogs
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {(!blogs || blogs.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#11152c] rounded-lg border border-[#1f223c] max-w-xl mx-auto my-6">
          <FaDev className="text-[#16f2b3] mb-3" size={48} />
          <p className="text-gray-300 text-base mb-4">
            Follow my latest technical articles, tutorials, and development insights directly on DEV Community.
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
          {blogs.slice(0, 6).map((blog, i) => (
            blog?.cover_image && <BlogCard blog={blog} key={i} />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-5 lg:mt-12">
        <Link
          className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
          role="button"
          href="/blog"
        >
          <span>View More</span>
          <FaArrowRight size={16} />
        </Link>
        <Link
          className="flex items-center gap-2 hover:gap-3 rounded-full border border-[#16f2b3] bg-[#0d1224] px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-[#16f2b3] no-underline transition-all duration-200 ease-out hover:bg-[#16f2b3] hover:text-[#0d1224] md:font-semibold"
          role="button"
          target="_blank"
          rel="noopener noreferrer"
          href={devProfileUrl}
        >
          <FaDev size={20} />
          <span>Read my articles</span>
        </Link>
      </div>
    </div>
  );
};

export default Blog;
