import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MenteeNetwork from "../containers/Network/MenteeNetwork";
const axios = require('axios');

jest.mock('axios');

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    }
})

test("Mentee are shown",  async () => {
    const user = userEvent.setup()
    axios.get.mockResolvedValue({
        data: {
            data: [
            {
                about: "rewf",
                career: ['Software engineer'],
                education: [],
                friend_list: ['22'],
                industry: ['FMTG'],
                name: "rewf",
                request: [],
                send_request: [],
                _id: "30"
            },
            {
                about: "Software Engineer at Solano",
                career: ['Software engineer', 'Data analyst'],
                education: [],
                friend_list: [],
                industry: ['Blockchain', 'Telecommunication'],
                name: "Wong Jing Yun",
                request: [],
                send_request: [],
                _id: "31"
            },
            {
                about: "Software Engineer at Solano",
                career: ['Software engineer', 'Data analyst'],
                education: [],
                friend_list: [],
                industry: ['Blockchain', 'Telecommunication'],
                name: "Wong Jing Yun",
                request: [],
                send_request: [],
                _id: "31"
            }
        ]
        }
    });

    render(<MenteeNetwork/>) 

    // screen.getByRole("")
    await waitFor(() => 
        expect(screen.getByTestId("mentorCard").children).toHaveLength(1)
    )
})