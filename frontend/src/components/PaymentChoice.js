import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import Pay from "./Pay";
import "./Pay.css";
import { FaDollarSign } from "react-icons/fa";
import PayNft from "./PayNft";

const PaymentChoice = ({
  children,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  refAgain,
  Moralis,
  EvmChain,
  sender_id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<FaDollarSign />}
          onClick={onOpen}
          colorScheme="grey"
          _hover={{ bg: "rgb(3, 252, 173);", color: "black" }}
          bg="rgb(48, 48, 48)"
          borderRadius="50%"
          marginLeft="8px"
          color="white"
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="280px"
          bg="transparent"
          backdropFilter="auto"
          backdropBlur="6px"
          color="white"
          padding={"10px"}
        >
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            
          >
            <div className="payment_choice one">
              <Pay
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
                refAgain={refAgain}
                toClose={onClose}
                Moralis={Moralis}
                EvmChain={EvmChain}
                sender_id={sender_id}

              ></Pay>
            </div>
            <div className="payment_choice two">
              <PayNft
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
                refAgain={refAgain}
                toClose={onClose}
                Moralis={Moralis}
                EvmChain={EvmChain}
                sender_id={sender_id}
                
              ></PayNft>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentChoice;
