import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Form from "../components/Form";
import Results from "../components/Results";
import { USGSReturnedObject } from "../types/USGSDataType";

const Home: NextPage = () => {
  const [data, setData] = useState<USGSReturnedObject | null>(null);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-slate-100">
      <Head>
        <title>Earthquake Map</title>
        <meta
          name="description"
          content="Map earthquakes using data from the USGS."
        />
        <meta name="author" content="Herman Cai" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Form setData={setData} />
      <Results data={data} />
      <Footer />
    </div>
  );
};

export default Home;
