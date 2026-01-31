import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, image, url, type = 'website', siteName = 'SHARP MART' }) => {
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Open Graph Metadata */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={type} />
      <meta property='og:url' content={url || window.location.href} />
      {image && <meta property='og:image' content={image} />}
      <meta property='og:site_name' content={siteName} />

      {/* Twitter Metadata */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {image && <meta name='twitter:image' content={image} />}
      
      {/* Canonical Link */}
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  siteName: PropTypes.string,
};

export default SEO;
