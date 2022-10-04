//check if upload works
//search works
//post shows
import { render, screen, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Home from "../containers/Home";
const axios = require("axios")

jest.mock("axios")

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    }
})

// test("check if posting story input modal shows", async() => {
//     const user = userEvent.setup()
//     axios.get.mockResolvedValue({
//         data: {
//             data: ['Software','Software','Software','Software','Software','Software','Software','Software','Software','Software']
//         }
//     })
//     .mockResolvedValue({
//                 data: {
//                     data: [{
//                         author: "35",
//                         content: "Hello World",
//                         image: "",
//                         tags: ['Software'],
//                         title: "Software Engineer"
//                     }]
//                 }
//             })
//     render(<Home />)
//     await user.click(screen.getByRole("button"))
//     // screen.getByRole("")
//     await waitFor(() => {
//         expect(screen.getByTestId("createPost")).toBeInTheDocument()
//     })
// })

test("posts are shown", async () => {
    axios.get.mockResolvedValue({
        data: {
            data: [{
                author: "35",
                content: "Hello World",
                image: "",
                tags: ['Software'],
                title: "Software Engineering"
            }]
        }
    })

    render(<Home/>)

    await waitFor(() => {
        expect(screen.getByTestId("post")).toBeInTheDocument()
    })
})