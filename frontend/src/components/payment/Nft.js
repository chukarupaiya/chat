import { React } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import "../Pay.css";

const Nft = (props) => {
  
  var amount = props.content;
  var status = "send";
  var date = new Date(props.date);
  var note = props.note;
  const month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  return (
    <div style={{ display: "flex" }} key={props.id}>
      {(isSameSender(props.messages, props.m, props.i, props.user_id) ||
        isLastMessage(props.messages, props.i, props.user_id)) && (
        <Tooltip label={props.sender_name} placement="bottom-start" hasArrow>
          <Avatar
            mt="7px"
            mr={1}
            size="sm"
            cursor="pointer"
            name={props.sender_name}
            src={props.sender_pic}
          />
        </Tooltip>
      )}
      <div
        style={{
          backgroundColor: `${
            props.sender_id === props.user_id
              ? "rgb(54,57,62)"
              : "rgb(40,43,48)"
          }`,
          marginLeft: isSameSenderMargin(
            props.messages,
            props.m,
            props.i,
            props.user_id
          ),
          marginTop: isSameUser(props.messages, props.m, props.i, props.user_id)
            ? 7
            : 10,
          borderRadius: "20px",
          padding: "5px 15px",
          maxWidth: "75%",
          minWidth: "260px",
          color: "white",
          height: "250px",
        }}
      >
        <p class="payment_user">NFT transfer</p>
        <img src={note} style={{"width":"auto","height":"150px","objectFit":"contain",margin:"10px auto"}}></img>
        <div style={{ display: "flex" }}>
          {props.sender_id === props.user_id && (<p class="payment_status">Sent&ensp;&ensp;</p>)}
          {props.sender_id != props.user_id && (<p class="payment_status">Received&ensp;&ensp;</p>)}
          <p class="payment_date">{month[date.getMonth()]}&ensp;{date.getDate()}</p>
        </div>
      </div>
    </div>
  );
};

export default Nft;
