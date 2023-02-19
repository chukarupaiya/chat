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
import MultiToken from "./payment/MultiToken";
import Nft from "./payment/Nft";
import PayToken from "./payment/PayToken";
import RequestCrowd from "./payment/RequestCrowd";
import RequestToken from "./payment/RequestToken";

const ScrollableChat = ({ messages, refAgain }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) =>
          m.payment ? (
            m.chat_mode == "private" ? (
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
                    note={m.note}
                    currency={m.currency}
                    token_address={m.token_address}
                    date={m.createdAt}
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
                    note={m.note}
                    currency={m.currency}
                    date={m.createdAt}
                  ></PayToken>
                )
              ) : (
                <Nft
                  sender_name={m.sender.name}
                  sender_pic={m.sender.pic}
                  sender_id={m.sender._id}
                  content={m.content}
                  id={m._id}
                  messages={messages}
                  m={m}
                  i={i}
                  user_id={user._id}
                  note={m.note}
                  currency={m.currency}
                  date={m.createdAt}
                ></Nft>
              )
            ) : m.payment_type == "token" ? (
              <MultiToken
                sender_name={m.sender.name}
                sender_pic={m.sender.pic}
                sender_id={m.sender._id}
                content={m.content}
                id={m._id}
                messages={messages}
                m={m}
                i={i}
                user_id={user._id}
                note={m.note}
                currency={m.currency}
                date={m.createdAt}
                to={m.token_address}
              ></MultiToken>
            ) : m.payment_type == "NFT" ? (
              <Nft
                sender_name={m.sender.name}
                sender_pic={m.sender.pic}
                sender_id={m.sender._id}
                content={m.content}
                id={m._id}
                messages={messages}
                m={m}
                i={i}
                user_id={user._id}
                note={m.note}
                currency={m.currency}
                date={m.createdAt}
              ></Nft>
            ) : (
              <RequestCrowd
                sender_name={m.sender.name}
                sender_pic={m.sender.pic}
                sender_id={m.sender._id}
                content={m.content}
                id={m._id}
                messages={messages}
                m={m}
                i={i}
                user_id={user._id}
                note={m.note}
                currency={m.currency}
                date={m.createdAt}
                to={m.token_address}
                last={m.payment_mode}
              />
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
