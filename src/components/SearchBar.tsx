/**
 * This component is a search bar that allows users to filter components by name.
 * It includes a clear button to reset the search input.
 */
import { TextField, TextFieldProps, InputAdornment, IconButton } from "@mui/material";
import { ReactNode } from "react";
import ClearIcon from "@mui/icons-material/Clear";

type SearchBarProps = Omit<TextFieldProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const SearchBar = ({ value, onChange, label = "Search", ...rest }: SearchBarProps): ReactNode => {
  const handleClear = () => {
    if (onChange) {
      onChange("");
    }
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      slotProps={{
        input: {
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton aria-label="clear search" onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      {...rest}
    />
  );
};

export default SearchBar;
