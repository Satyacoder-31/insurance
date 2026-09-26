import { useState } from "react";
import { registerUserInSupabase } from "../../../supabaseClient";
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

function SignupForm({ gotoPrevious }) {
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [inputState, setInputState] = useState({
    phoneNumber: "",
    name: "",
    password: "",
  });
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
    } else if (inputState.name.trim().length === 0) {
      toast({
        title: "Name is required",
        description: "Please enter your full name.",
        status: "warning",
        isClosable: true,
      });
      return;
    } else if (inputState.password.length < 4) {
      toast({
        title: "Password too short",
        description: "Password should be at least 4 characters.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const result = await registerUserInSupabase({
      name: inputState.name.trim(),
      phoneNumber: inputState.phoneNumber,
      password: inputState.password,
    });
    setLoading(false);

    if (result.success) {
      setSubmissionStatus(true);
      toast({
        title: "Account Created!",
        description: "Your SafeLife account is ready. Redirecting to login...",
        status: "success",
        isClosable: true,
      });
      setTimeout(() => {
        setSubmissionStatus(false);
        gotoPrevious();
      }, 2000);
    } else {
      toast({
        title: "Registration Failed",
        description: result.message,
        status: "error",
        isClosable: true,
      });
      if (result.message && result.message.includes("already registered")) {
        setTimeout(() => {
          gotoPrevious();
        }, 1500);
      }
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
          Registration Complete!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Your account has been saved in Supabase. Please sign in with your password.
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

        <FormControl isInvalid={false}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Full Name"
              name="name"
              value={inputState.name}
              onChange={handleValuedInput}
            />
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={inputState.password.length > 0 && inputState.password.length < 4}>
          <InputGroup>
            <Input
              type="password"
              placeholder="Create Password (min 4 characters)"
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
          loadingText="Creating Account..."
          colorScheme="blue"
          width="100%"
          onClick={handleFormSubmit}
        >
          Sign Up with SafeLife
        </Button>
      </VStack>
    </div>
  );
}

export default SignupForm;
