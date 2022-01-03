module.exports = {
  siteMetadata: {
    siteUrl: "https://www.superurbancat.com",
    title: "nft_minting_dapp",
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
  ],
};
