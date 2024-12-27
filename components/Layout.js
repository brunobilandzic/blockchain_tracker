import React, { use, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isMempool, setIsMempool] = useState(false);
  useEffect(() => {
    if (router.pathname === "/mempool") {
      setIsMempool(true);
    } else {
      document.body.style.backgroundColor = "rgb(248 250 252)";
      setIsMempool(false);
    }
  }, [router.pathname]);
  return (
    <div className={`${!isMempool ? "bg-slate-50" : "bg-inherit"} `}>
      <Head>
        <title>Blockchain Tracker</title>
        <meta name="description" content="Track your blockchain transactions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
const Navbar = () => {
  return (
    <nav>
      <ul className="flex justify-start gap-4 text-3xl items-center py-4">
        <li>
          <Link className="cursor:pointer hover:text-gray-700" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="cursor:pointer  hover:text-gray-700" href="/mempool">
            Mempool
          </Link>
        </li>
        <li>
          <Link className="cursor:pointer  hover:text-gray-700" href="/builder">
            Builder
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Layout;
