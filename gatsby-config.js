module.exports = {
  siteMetadata: {
    siteUrl: "https://www.superurbancat.com",
    title: "Super Urban Cat NFT Minting dApp",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",    
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {        
        trackingId: "G-0B38DFTJS0",
        head: true
      }
    }
  ],
};
