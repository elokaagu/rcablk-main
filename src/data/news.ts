export interface NewsArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  body: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "the-tintype-archive",
    title: "The Tintype Archive",
    category: "Announcement",
    date: "March 26, 2025",
    image: "/assets/news-tintype-archive.jpg",
    body: [
      "The Tintype Archive Black Skin on Tin x RCA BLK by 2024 graduate Shayla Marshall @shaylamonii",
      "Supported through The RCA BLK Research Hub: The Tintype archive offers a unique opportunity to create an archival collection of work.",
      "During Marshall's fellowship she will be documenting the extended network of Black Scholars at the Royal College of Art both past and present using the method of tintype photography.",
      "Tintype, also known as wet plate collodion, is one of the earliest image capture techniques. Developed in the 19th century, this method of photographing onto tin was initially accessible only to the affluent. For black individuals, having their portraits taken was uncommon; the earliest records depict images of slaves as an extension of their owners' wealth. Later, there were the rare images of wealthy black individuals; however, even then, these images depicted them as assimilated into white colonialism rather than in their true cultural identities.",
      "This project will aim to capture 30 artists from RCA BLK's extended network.",
      "Creating a contemporary archival legacy project of images that reclaims historical photo taking, bridging a new dimension to the existing cannon of Photography.",
    ],
  },
  {
    slug: "rca-blk-research-fellowship",
    title: "RCA BLK Research Fellowship",
    category: "Announcement",
    date: "March 26, 2025",
    image: "/assets/news-research-fellowship.jpg",
    body: [
      "RCA BLK is proud to announce the launch of the RCA BLK Research Fellowship programme.",
    ],
  },
  {
    slug: "the-nu-black-archive",
    title: "The Nu Black Archive",
    category: "Announcement",
    date: "March 26, 2025",
    image: "/assets/news-nu-black-archive.jpg",
    body: [
      "The Nu Black Archive is a new initiative by RCA BLK.",
    ],
  },
  {
    slug: "black-star-time-capsule",
    title: "BLACK STAR Time Capsule",
    category: "Announcement",
    date: "March 26, 2025",
    image: "/assets/news-black-star.jpg",
    body: [
      "BLACK STAR Time Capsule is an exhibition exploring themes of identity and legacy.",
    ],
  },
  {
    slug: "sir-frank-bowling-scholarship",
    title: "Sir Frank Bowling Scholarship",
    category: "Announcement",
    date: "February 10, 2025",
    image: "/assets/news-frank-bowling.jpg",
    body: [
      "The Sir Frank Bowling Scholarship supports emerging artists of Black and African heritage at the Royal College of Art.",
    ],
  },
];
