const sampleListings = [
  {
    title: "Robotics Club",
    description: "Build autonomous robots and participate in robotics competitions and innovation challenges.",
    image: {
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=60",
      filename: "robotics-club"
    },
    price: 1000,
    location: "Innovation Lab",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.856285, 18.515669]
    },
    __v: 0
  },
  {
    title: "AI & ML Club",
    description: "Explore Artificial Intelligence, Machine Learning, and Data Science through projects.",
    image: {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=60",
      filename: "ai-ml-club"
    },
    price: 900,
    location: "Computer Department",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.856620, 18.515820]
    },
    __v: 0
  },
  {
    title: "Cyber Security Club",
    description: "Learn ethical hacking, penetration testing, and digital forensics through practical workshops.",
    image: {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60",
      filename: "cyber-security-club"
    },
    price: 750,
    location: "Computer Engineering Block",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.856900, 18.515940]
    },
    __v: 0
  },
  {
    title: "Open Source Club",
    description: "Contribute to open-source projects, participate in Hacktoberfest, and collaborate with developers worldwide.",
    image: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60",
      filename: "open-source-club"
    },
    price: 600,
    location: "Innovation Center",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.857180, 18.516050]
    },
    __v: 0
  },
  {
    title: "Coding Ninjas Club",
    description: "Sharpen your coding skills through contests, interview preparation, and placement workshops.",
    image: {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
      filename: "coding-ninjas-club"
    },
    price: 650,
    location: "Computer Lab",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.857450, 18.516160]
    },
    __v: 0
  },
  {
    title: "Entrepreneurship Cell (E-Cell)",
    description: "Promotes startups, innovation, business planning, and entrepreneurship among students.",
    image: {
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
      filename: "entrepreneurship-cell"
    },
    price: 1200,
    location: "Incubation Center",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.857720, 18.516300]
    },
    __v: 0
  },
  {
    title: "Photography Club",
    description: "Capture memorable moments and improve photography skills through events and competitions.",
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
      filename: "photography-club"
    },
    price: 400,
    location: "Student Activity Center",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.857980, 18.516450]
    },
    __v: 0
  },
  {
    title: "Dance Club",
    description: "Learn various dance forms and perform at cultural festivals and competitions.",
    image: {
      url: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=60",
      filename: "dance-club"
    },
    price: 350,
    location: "College Auditorium",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.858250, 18.516560]
    },
    __v: 0
  },
  {
    title: "Music Club",
    description: "Develop singing and instrumental skills while performing at campus events.",
    image: {
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=60",
      filename: "music-club"
    },
    price: 450,
    location: "Music Room",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.858520, 18.516690]
    },
    __v: 0
  },
  {
    title: "Drama Club",
    description: "Practice acting, stage performance, and storytelling through theatre productions.",
    image: {
      url: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=60",
      filename: "drama-club"
    },
    price: 500,
    location: "College Auditorium",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.858780, 18.516820]
    },
    __v: 0
  },
  {
    title: "NSS (National Service Scheme)",
    description: "Participate in social service activities, blood donation camps, and community development programs.",
    image: {
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=60",
      filename: "nss-club"
    },
    price: 200,
    location: "College Campus",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.859040, 18.516950]
    },
    __v: 0
  },
  {
    title: "NCC (National Cadet Corps)",
    description: "Develop leadership, discipline, and patriotism through military and adventure training.",
    image: {
      url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60",
      filename: "ncc-club"
    },
    price: 300,
    location: "College Ground",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.859310, 18.517070]
    },
    __v: 0
  },
  {
    title: "Literary Club",
    description: "Enhance public speaking, debating, creative writing, and communication skills.",
    image: {
      url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=60",
      filename: "literary-club"
    },
    price: 250,
    location: "Central Library",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.859570, 18.517190]
    },
    __v: 0
  },
  {
    title: "Sports Club",
    description: "Participate in cricket, football, volleyball, badminton, athletics, and other sports events.",
    image: {
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60",
      filename: "sports-club"
    },
    price: 700,
    location: "Sports Complex",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.859840, 18.517320]
    },
    __v: 0
  },
  {
    title: "Hackathon Club",
    description: "Prepare for national and international hackathons with mentoring and project-building sessions.",
    image: {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60",
      filename: "hackathon-club"
    },
    price: 1000,
    location: "Innovation Lab",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.860100, 18.517450]
    },
    __v: 0
  },
  {
    title: "UI/UX Design Club",
    description: "Learn Figma, Adobe XD, wireframing, prototyping, and user experience design.",
    image: {
      url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=60",
      filename: "ui-ux-design-club"
    },
    price: 650,
    location: "Design Studio",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.860360, 18.517570]
    },
    __v: 0
  },
  {
    title: "Women in Tech Club",
    description: "Empower women in technology through mentorship, networking, and technical workshops.",
    image: {
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
      filename: "women-in-tech-club"
    },
    price: 400,
    location: "Engineering Block",
    country: "India",
    reviews: [],
    geometry: {
      type: "Point",
      coordinates: [73.860620, 18.517700]
    },
    __v: 0
  }
];

module.exports = { data: sampleListings };