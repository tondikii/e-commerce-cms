import type {ChangeEvent, FC} from "react";
import {FormLabel, RadioGroup, Sheet} from "@mui/joy";
import Radio, {radioClasses} from "@mui/joy/Radio";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlasses, faShirt, faUserTie} from "@fortawesome/free-solid-svg-icons";
import {CheckCircleRounded} from "@mui/icons-material";

interface Props {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const styles: {id: number; name: string; icon: React.ReactNode}[] = [
  {
    id: 1,
    name: "Casual",
    icon: <FontAwesomeIcon icon={faShirt} />,
  },
  {id: 2, name: "Formal", icon: <FontAwesomeIcon icon={faUserTie} />},
  {id: 3, name: "Party", icon: <FontAwesomeIcon icon={faGlasses} />},
];

const RadioGroupStyles: FC<Props> = ({onChange}) => {
  return (
    <RadioGroup
      defaultValue="Website"
      overlay
      name="styleId"
      sx={{
        flexDirection: "row",
        gap: 2,
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: "3px solid",
            borderColor: "#212b36",
          },
        },
        [`& .${radioClasses.radio}`]: {
          display: "contents",
          "& > svg": {
            zIndex: 2,
            position: "absolute",
            top: "-8px",
            right: "-8px",
            bgcolor: "#212b36",
            borderRadius: "50%",
            color: "#ffffff",
          },
        },
        alignSelf: "center",
      }}
      onChange={onChange}
    >
      {styles.map(({id, name, icon}) => (
        <Sheet
          key={id}
          variant="outlined"
          sx={{
            borderRadius: "md",

            boxShadow: "sm",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            minWidth: 120,
          }}
        >
          <Radio id={name} value={id} checkedIcon={<CheckCircleRounded />} />
          {icon}
          <FormLabel htmlFor={name}>{name}</FormLabel>
        </Sheet>
      ))}
    </RadioGroup>
  );
};
export default RadioGroupStyles;
