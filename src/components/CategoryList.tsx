/**
 * This component renders a list of categories with their counts.
 */
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { CATEGORY_ALL, CATEGORY_ALL_RESULTS } from "../types";

type Category = {
  name: string;
  count: number;
};

type CategoryListProps = {
  categoriesWithCounts: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
};

const CategoryList = ({ categoriesWithCounts, selectedCategory, onSelectCategory }: CategoryListProps) => {
  const isSelected = (category: string, selectedCategory: string | null) => {
    if (selectedCategory === CATEGORY_ALL && category === CATEGORY_ALL_RESULTS) {
      return true;
    }
    return selectedCategory === category;
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Fixed header */}
      <Typography variant="h6" sx={{ mb: 2, flexShrink: 0 }}>
        Categories
      </Typography>

      {/* Scrollable list area */}
      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
        <List disablePadding>
          {categoriesWithCounts.map(({ name, count }) => (
            <ListItemButton
              key={name}
              selected={isSelected(name, selectedCategory)}
              onClick={() => onSelectCategory(name)}
            >
              <ListItemText primary={`${name} (${count})`} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default CategoryList;
