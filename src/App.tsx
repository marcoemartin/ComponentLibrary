/**
 * This component ties all our components together.
 * It includes a search bar, category list, and component list.
 * It handles filtering components based on search input and selected categories.
 *
 * The app is designed to be responsive and works well on varying screen sizes and resizing.
 */
import { useEffect, useState, useMemo } from "react";
import { Box, Paper } from "@mui/material";
import SearchBar from "./components/SearchBar";
import CategoryList from "./components/CategoryList";
import ComponentList from "./components/ComponentList";
import { CATEGORY_ALL, CATEGORY_ALL_RESULTS, LibraryDataType } from "./types";
import { filterComponents, getCategoryCounts } from "./utils/filterUtils";

const Library: LibraryDataType = {
  Components: [
    {
      Name: "Free Form Container",
      Categories: ["Layout"],
    },
    {
      Name: "Flex Container",
      Categories: ["Layout"],
    },
    {
      Name: "Bar Chart",
      Categories: ["Charts"],
    },
    {
      Name: "Line Chart",
      Categories: ["Charts"],
    },
    {
      Name: "Button",
      Categories: ["Controls"],
    },
    {
      Name: "Input Field",
      Categories: ["Controls", "Inputs"],
    },
    {
      Name: "Checkbox",
      Categories: ["Controls", "Inputs"],
    },
    {
      Name: "Radio Button",
      Categories: ["Controls", "Inputs"],
    },
    {
      Name: "Switch Button",
      Categories: ["Custom"],
    },
    {
      Name: "Icon Button",
      Categories: ["Controls"],
    },
  ],
  Categories: ["Controls", "Inputs", "Layout", "Custom", "Charts"],
};

// Function to add a large number of categories and components for testing
function addBigData(categories: number, components: number) {
  for (let i = 0; i < categories; i++) {
    Library.Categories.push("Category" + i);
  }
  for (let i = 0; i < components; i++) {
    Library.Components.push({
      Name: "Comp" + i,
      Categories: ["Category" + (i % categories), "Category" + ((i + 1) % categories)],
    });
  }
}
addBigData(30, 1000000);

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(CATEGORY_ALL);
  const [filteredComponents, setFilteredComponents] = useState(Library.Components);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Derive category count mapping
  const categoriesCount = useMemo(() => {
    // Get visible categories based on search term
    const visibleCategories = searchTerm ? Library.Categories.filter((cat) => categoryCounts[cat]) : Library.Categories;

    // Create the full categories list with "All" first
    const categoriesToDisplay = [CATEGORY_ALL, ...visibleCategories];

    // Create the mapped categories with names and counts
    return categoriesToDisplay.map((cat) => ({
      name: cat === CATEGORY_ALL && searchTerm ? CATEGORY_ALL_RESULTS : cat,
      count: cat === CATEGORY_ALL ? filteredComponents.length : categoryCounts[cat] || 0,
    }));
  }, [categoryCounts, searchTerm, filteredComponents]);

  // Handle search filtering
  useEffect(() => {
    // Create new AbortController for this search
    const abortController = new AbortController();

    // Start async search operation
    const performSearch = async () => {
      try {
        // Reset selected category to "All" when search changes
        setSelectedCategory(CATEGORY_ALL);

        // Create a signal to pass to async operations
        const signal = abortController.signal;

        // Retreive the filtered results with an aborable promise
        const filtered = await filterComponents(Library.Components, searchTerm, signal);

        // Update filtered components
        setFilteredComponents(filtered ?? displayedComponents);

        // Calculate category counts
        const counts = getCategoryCounts(filtered ?? displayedComponents);
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    performSearch();

    // Cleanup: abort any in-progress operation when unmounting or when searchTerm changes
    return () => {
      abortController.abort();
    };
  }, [searchTerm]);

  // Compute the displayed components based on selected category
  const displayedComponents = useMemo(() => {
    if (selectedCategory && selectedCategory !== CATEGORY_ALL && selectedCategory !== CATEGORY_ALL_RESULTS) {
      return filteredComponents.filter((comp) => comp.Categories.includes(selectedCategory));
    }
    return filteredComponents;
  }, [selectedCategory, filteredComponents]);

  return (
    <Box
      sx={{
        width: "100vw",
        minWidth: "100vw",
        maxWidth: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: { xs: 2, sm: 5, md: 10, lg: 15 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Search Bar */}
        <Box sx={{ py: 3, boxSizing: "border-box", width: "100%" }}>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flex: 1,
            gap: 3,
            minHeight: 0,
            mb: 3,
            boxSizing: "border-box",
            overflow: "hidden",
            p: "3px",
            width: "100%",
          }}
        >
          {/* Category List Column */}
          <Box sx={{ width: 250, flexShrink: 0, boxSizing: "border-box" }}>
            <Paper
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxSizing: "border-box",
                  overflow: "auto",
                }}
              >
                <CategoryList
                  categoriesWithCounts={categoriesCount}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </Box>
            </Paper>
          </Box>

          {/* Component List Column */}
          <Box sx={{ flex: 1, boxSizing: "border-box" }}>
            <Paper
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxSizing: "border-box",
                  overflow: "auto",
                }}
              >
                <ComponentList components={displayedComponents} />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
