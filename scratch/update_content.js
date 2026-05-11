const fs = require('fs');

const filesToUpdate = [
  'c:/entraiot-production-final/entraiot-unified/stage1/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/entraiot-unified/stage2/public/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/repo_check/stage1/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/repo_check/stage2/public/assets/CountryFrance-BVz2pCNL.js'
];

const target1 = `F.jsx("h1",{children:"Hi!"}),F.jsx("p",{children:\`I'm Entraiot Solution, a french "Gen X" World Begins. Throughout my career, I have worked on multiple sized projects in various roles, including Project Manager, Designer and Front/Back-end Developer.\`}),F.jsx("p",{children:"I'm entirely self-taught, I haven't attended a specialized school or completed a bootcamp. I learned on the job and with over 20 years experience I'm proud to say I'm still as passionate as ever."}),F.jsx("p",{children:"Through this website, I wanted to leverage what I have learned in recent years, particularly in terms of 3D. You will also find a overview of my most important projects."}),F.jsx("p",{children:"Let's keep scrolling to discover the rest :)"})`;

const target2 = `F.jsx("h1",{children:"Hi!"}),F.jsx("p",{children:\`I'm Entraiot Solution, a french "Gen X" Web Engineer. Throughout my career, I have worked on multiple sized projects in various roles, including Project Manager, Designer and Front/Back-end Developer.\`}),F.jsx("p",{children:"I'm entirely self-taught, I haven't attended a specialized school or completed a bootcamp. I learned on the job and with over 20 years experience I'm proud to say I'm still as passionate as ever."}),F.jsx("p",{children:"Through this website, I wanted to leverage what I have learned in recent years, particularly in terms of 3D. You will also find a overview of my most important projects."}),F.jsx("p",{children:"Let's keep scrolling to discover the rest :)"})`;

const replacement = `F.jsx("h1",{children:"Hi!"}),F.jsx("p",{children:\`To become a global leader in IoT and AI innovation by creating intelligent, sustainable, and human-centric ecosystems that transform businesses, empower industries, and enhance everyday life through smart automation and data-driven decision-making.\`}),F.jsx("p",{children:\`Entraiot's vision extends beyond business by contributing to society through sustainability initiatives such as energy saving and smart resource usage, enabling smart cities and smarter living environments, and improving overall quality of life.\`}),F.jsx("p",{children:\`Entraiot Mission: We simplify complex technology into user-friendly, scalable solutions that deliver measurable business results. To deliver innovative IoT and AI solutions that enable businesses to automate operations, gain real-time insights, and improve efficiency through reliable and scalable technology.\`}),F.jsx("p",{children:\`Our aim is to launch 5+ IoT solutions in the next year, expand into 3 industries, achieve X number of clients, and build a scalable SaaS platform. Entraiot Solutions shows that we don't just design—we execute end-to-end solutions.\`})`;

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const before = content;
    // Perform global replacement for both forms
    content = content.replaceAll(target1, replacement);
    content = content.replaceAll(target2, replacement);
    if (before !== content) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully updated content in: ${file}`);
    } else {
      console.log(`No matching target content found in: ${file}`);
    }
  } else {
    console.log(`File does not exist: ${file}`);
  }
});
