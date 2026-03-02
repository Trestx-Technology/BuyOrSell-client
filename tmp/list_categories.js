
const fetch = require('node-fetch');

async function checkCategories() {
  const BACKEND_URL = "https://api_dev.buyorsell.ae/api/v1";
  try {
    const response = await fetch(`${BACKEND_URL}/categories/tree`);
    const result = await response.json();
    const categories = result.data || [];

    const allCategories = [];

    function traverse(cats, path = "") {
      cats.forEach((cat) => {
        const currentPath = path ? `${path} > ${cat.name}` : cat.name;
        const isLeaf = !cat.children || cat.children.length === 0;
        
        allCategories.push({
          id: cat._id,
          name: cat.name,
          path: currentPath,
          isLeaf: isLeaf,
        });

        if (!isLeaf) {
          traverse(cat.children, currentPath);
        }
      });
    }

    traverse(categories);

    console.log(`Total Categories found: ${allCategories.length}`);
    console.log("Filtering for 'jewel' or 'watch'...");
    console.log("--------------------------------------------------");
    allCategories.forEach(c => {
      if (c.path.toLowerCase().includes('jewel') || c.path.toLowerCase().includes('watch')) {
        console.log(`${c.path} (ID: ${c.id})${c.isLeaf ? "" : " [Group]"}`);
      }
    });
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

checkCategories();
