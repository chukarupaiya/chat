import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import "./Pay.css";
import PayToken from "./payment/PayToken";
import RequestToken from "./payment/RequestToken";

const ScrollableChat = ({ messages ,refAgain}) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) =>
          m.payment ? (
            m.payment_type == "token" ? (
              m.payment_mode == "request" ? (
                <RequestToken
                  sender_name={m.sender.name}
                  sender_pic={m.sender.pic}
                  sender_id={m.sender._id}
                  content={m.content}
                  id={m._id}
                  messages={messages}
                  m={m}
                  i={i}
                  user_id={user._id}
                  refAgain={refAgain}
                ></RequestToken>
              ) : (
                <PayToken
                  sender_name={m.sender.name}
                  sender_pic={m.sender.pic}
                  sender_id={m.sender._id}
                  content={m.content}
                  id={m._id}
                  messages={messages}
                  m={m}
                  i={i}
                  user_id={user._id}
                ></PayToken>
              )
            ) : (
              <div></div>
            )
          ) : (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id
                      ? "rgb(54,57,62)"
                      : "rgb(40,43,48)"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  color: "white",
                }}
              >
                {m.content}
              </span>
            </div>
          )
        )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
