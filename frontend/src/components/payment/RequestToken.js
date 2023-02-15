import {React} from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import "../Pay.css";
import axios from "axios";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";


const RequestToken=(props)=>{
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

    const toast = useToast();

  const updateMessages = async () => {
   
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("updating"+props.id);
      const { data } = await axios.post(
        `/api/message/update`,
        {
          messageId:props.id
        },
        config
      );
      console.log("updating");
      console.log(data);
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
   props.refAgain();
  };



  var receiver="karupaiya";
  var amount=props.content;
  var status="Requested";
  var date="Dec 30";



    return(
        <div style={{ display: "flex" }} key={props.id}>
              {(isSameSender(props.messages, props.m, props.i, props.user_id) ||
                isLastMessage(props.messages, props.i, props.user_id)) && (
                <Tooltip
                  label={props.sender_name}
                  placement="bottom-start"
                  hasArrow
                >
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
                  marginLeft: isSameSenderMargin(props.messages, props.m, props.i, props.user_id),
                  marginTop: isSameUser(props.messages, props.m, props.i, props.user_id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  minWidth:"230px",
                  color: "white",
                  height:props.sender_id === props.user_id?"140px":"180px",
                }}
              >
                <p class="payment_user">Requested to {receiver}</p>
                <p class="payment_amount">${amount}</p>
                <div style={{"display":"flex"}}>
                  <p class="payment_status">{status}&ensp;&ensp;</p>
                  <p class="payment_date">{date}</p>
                </div>
                <div>
                  {!(props.sender_id === props.user_id) && <button class={"pay_btn"} onClick={updateMessages}>pay</button>}
                </div>
              </div>
            </div>
    );
}


export default RequestToken;