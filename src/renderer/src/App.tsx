import { useEffect, useState } from 'react';
import './App.scss';
import { API_BASE_URL } from "./ts/config";
import { GameLayout } from './ts/components/GameLayout';
import { Header } from './ts/partials/Header';
import { Footer } from './ts/partials/Footer';
import { Helmet } from 'react-helmet-async';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<{[key: string]: any}>({});
  const [globalContent, setGlobalContent] = useState<{[key: string]: any}>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/game-2048/api/`)
      .then(response => response.json())
      .then(fetchedData => {
        setContent(fetchedData.content);
        setGlobalContent(fetchedData.global_content);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {!loading && (
        <>
          <Helmet>
            <title>{content.meta_details.title}</title>
            <meta name="description" content={content.meta_details.description}/>
            <meta name="keywords" content={content.meta_details.keywords}/>
            <meta name="author" content={globalContent.meta_details.author}/>

            <meta property="og:title" content={content.meta_details.title}/>
            <meta property="og:description" content={content.meta_details.description}/>
            <meta property="og:site_name" content={content.meta_details.site_name}/>
            <meta property="og:type" content={globalContent.meta_details.og_type}/>
            <meta property="og:url" content={`${globalContent.site_url}/projects/game-2048/`}/>
            <meta property="og:image" content={content.meta_details.og_image}/>

            <meta name="twitter:card" content={globalContent.meta_details.twitter_card}/>
            <meta name="twitter:site" content={globalContent.meta_details.twitter_site}/>
            <meta name="twitter:title" content={content.meta_details.title}/>
            <meta name="twitter:description" content={content.meta_details.description}/>

            <link href={`${globalContent.site_url}/projects/game-2048/`} rel="canonical"/>
          </Helmet>
          <Header content={content} />
          <GameLayout content={content} />
          <Footer content={content} />
        </>
      )}
    </>
  )
}
