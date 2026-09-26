import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../Redux/Login/loginAction";
import { loginUserWithSupabase } from "../../../supabaseClient";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [loggedUserName, setLoggedUserName] = useState("");
  const [inputState, setInputState] = useState({
    phoneNumber: "",
    password: "",
  });

  const dispatch = useDispatch();
  const toast = useToast({ position: "top" });

  const handleValuedInput = (e) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (inputState.phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        status: "error",
        isClosable: true,
      });
      return;
    } else if (inputState.password.length < 4) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 4 characters.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const result = await loginUserWithSupabase(inputState.phoneNumber, inputState.password);
    setLoading(false);

    if (result.success) {
      const user = result.user;
      setLoggedUserName(user.name);
      sessionStorage.setItem("loggedInUserInfo", JSON.stringify(user));
      setSubmissionStatus(true);
      toast({
        title: `Welcome back, ${user.name}!`,
        description: "Successfully authenticated with SafeLife.",
        status: "success",
        isClosable: true,
      });

      setTimeout(() => {
        setSubmissionStatus(false);
        loginAction(user, dispatch);
      }, 2000);
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (submissionStatus) {
    return (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="12px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Login Success!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Welcome, {loggedUserName}! You have been successfully logged into SafeLife.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <VStack spacing={6} align="flex-start">
        <FormControl isInvalid={inputState.phoneNumber.length > 10}>
          <InputGroup>
            <InputLeftAddon children="+91" />
            <Input
              type="tel"
              placeholder="Mobile Number"
              name="phoneNumber"
              maxLength={10}
              value={inputState.phoneNumber}
              onChange={handleValuedInput}
            />
          </InputGroup>
          {inputState.phoneNumber.length > 10 && (
            <FormErrorMessage>
              Phone number cannot exceed 10 digits.
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={inputState.password.length > 0 && inputState.password.length < 4}>
          <InputGroup>
            <Input
              type="password"
              placeholder="Password (min 4 characters)"
              name="password"
              value={inputState.password}
              onChange={handleValuedInput}
            />
          </InputGroup>
          {inputState.password.length > 0 && inputState.password.length < 4 && (
            <FormErrorMessage>
              Password must be at least 4 characters.
            </FormErrorMessage>
          )}
        </FormControl>

        <Button
          isLoading={loading}
          loadingText="Authenticating..."
          colorScheme="blue"
          width="100%"
          onClick={handleFormSubmit}
        >
          Sign In with SafeLife
        </Button>
      </VStack>
    </div>
  );
}

export default LoginForm;
