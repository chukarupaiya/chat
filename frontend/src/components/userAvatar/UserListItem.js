import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction ,key,user}) => {
 

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="rgb(54,57,62)"
      _hover={{ bg: "#e2b2ff;", color: "black" }}
      w="100%"
      d="flex"
      alignItems="center"
      color="white"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name.substring(0,8)+"....."+user.name.substring(user.name.length-8)}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
