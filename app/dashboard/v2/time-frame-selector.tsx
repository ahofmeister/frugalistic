import { TimeFrame } from "@/app/dashboard/v2/time-frame";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function TimeFrameSelector(props: {
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={props.timeFrame}
      onValueChange={(value: TimeFrame) => value && props.setTimeFrame(value)}
      className="p-1 rounded-md"
    >
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
