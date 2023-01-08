import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";

export const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "whitesmoke",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "whitesmoke",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "whitesmoke",
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: "whitesmoke",
  },
  [`&:hover .${outlinedInputClasses.input}`]: {
    color: "whitesmoke",
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]:
    {
      color: "whitesmoke",
    },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "whitesmoke",
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "whitesmoke",
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "whitesmoke",
  },
});

export const StyledAutocomplete = styled(Autocomplete)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "whitesmoke",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "whitesmoke",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "whitesmoke",
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: "whitesmoke",
  },
  [`&:hover .${outlinedInputClasses.input}`]: {
    color: "whitesmoke",
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]:
    {
      color: "whitesmoke",
    },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "whitesmoke",
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "whitesmoke",
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "whitesmoke",
  },
});
