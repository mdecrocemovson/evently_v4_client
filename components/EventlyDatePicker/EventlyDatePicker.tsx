import { View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePicker as WebPicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";

interface IDatePickerProps {
  date: Date;
  mode: "date" | "time" | "datetime" | "countdown";
  onChange: any;
}

const EventlyDatePicker = ({ date, mode, onChange }: IDatePickerProps) => {
  if (Platform.OS === "web") {
    return (
      <View>
        <WebPicker
          value={moment(date)}
          onChange={(newValue) => onChange(newValue)}
        />
      </View>
    );
  }
  return (
    <View>
      <DateTimePicker
        themeVariant="dark"
        value={date}
        mode={mode}
        onChange={(e, d) => onChange(d)}
      />
    </View>
  );
};

export default EventlyDatePicker;
