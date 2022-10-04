import {cleanup,render, screen } from "@testing-library/react"
import { fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Signup from "../containers/Signup/signup";

afterEach(cleanup)

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    }
})

test("signup is not allowed",  async () => {
    const user = userEvent.setup()
    render(<Signup />)  
    
    await user.type(screen.getByRole("textbox", {name: /Name/i}), "Wong Jing Yun")
    await user.type(screen.getByTestId("email"), "jingyun0309@gmail.com")
    await user.type(screen.getByTestId("phone"), "97737947")
    await user.type(screen.getByTestId("dob"), "2000-09-03")
    await user.type(screen.getByTestId("pw"), "Jingyun123")
    await user.type(screen.getByTestId("pw_cfm"), "2000-03-09")
    await user.click(screen.getByTestId("mentor"))
    await user.click(screen.getByRole("button", {name: /Sign Up/i}))
    expect(screen.getByTestId("fail_pw").textContent).toBe("Password do not match")
})

test("signup is allowed",  async () => {
    const user = userEvent.setup()
    render(<Signup />)  
    
    await user.type(screen.getByRole("textbox", {name: /Name/i}), "Wong Jing Yun")
    await user.type(screen.getByTestId("email"), "jingyun0309@gmail.com")
    await user.type(screen.getByTestId("phone"), "97737947")
    await user.type(screen.getByTestId("pw"), "Jingyun123")
    await user.type(screen.getByTestId("pw_cfm"), "Jingyun123")
    await user.click(screen.getByRole("radio", {name: /Mentor/i}))
    await user.click(screen.getByRole("button", {name: /Sign Up/i}))
    expect(screen.getByTestId("fail_pw").textContent).toBe("")
})



