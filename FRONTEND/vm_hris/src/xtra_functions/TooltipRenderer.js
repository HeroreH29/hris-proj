import { Tooltip } from "react-bootstrap";

const TooltipRenderer = ({ tip = "" }) => {
  return <Tooltip placement="auto">{tip}</Tooltip>;
};

export default TooltipRenderer;
