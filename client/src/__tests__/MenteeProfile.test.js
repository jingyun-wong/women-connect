import { render, screen, waitFor } from "@testing-library/react"
import { fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import MenteeProfile from "../containers/Profile/MenteeProfile"
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

// test("Name is updated",  async () => {
//     const user = userEvent.setup()
//     axios.get.mockResolvedValue({
//         data: {
//             data: {
//                 dob: "2000-09-09",
//                 email: "fy@gmail.com",
//                 id: "37",
//                 name: "Bryan Shing",
//                 phone_number: "67601234",
//                 role: "mentee"
//             }
//         }
//     });
//     .mockResolvedValue({
//         data: {
//             data: {
//                 about: "Hello",
//                 career: [],
//                 industry: [],
//                 education: [],
//                 profile_pic:"",
//                 friend_list: []
//             }
//         }
//     });

//     render(<MenteeProfile/>) 

//     await waitFor(() => 
//         expect(screen.getByTestId("name").textContent).toBe("Bryan Shing")
//     )
// })

test("Profile (About, Career Interest & Industry) is updated",  async () => {
    const user = userEvent.setup()
    axios.get.mockResolvedValue({
        data: {
            data: {
                about: "Hello World",
                career: ['Software engineer', 'Data analyst'],
                education: [],
                friend_list: [],
                id: "37",
                industry: ['Tech Giants'],
                request: [],
                send_request: []                
            }
        }
    });

    render(<MenteeProfile/>) 

    await waitFor(() => 
        expect(screen.getByTestId("about").textContent).toBe("Hello World")
    )
    await waitFor(() => 
        expect(screen.getByTestId("career").textContent).toBe("Software engineerData analyst")
    )
    await waitFor(() => 
        expect(screen.getByTestId("industries").textContent).toBe("Tech Giants")
    )
})

test("Profile (Education) is updated",  async () => {
    const user = userEvent.setup()
    axios.get.mockResolvedValue({
        data: {
            data: {
                about: "Hello World",
                career: ['Software engineer', 'Data analyst'],
                education: 
                [
                    {course: 'Information System', 
                    desc: '- Interested in Data Science', 
                    period: ["2022-05-31T16:00:00.000Z","2022-07-27T16:00:00.000Z"], 
                    school: 'Singapore Management University'}
                ],
                friend_list: [],
                id: "37",
                industry: ['Tech Giants'],
                request: [],
                send_request: []         
            }
        }
    });

    render(<MenteeProfile/>) 

    await waitFor(() => 
        expect(screen.getByRole("list", {name: ""}).textContent).toBe(" Singapore Management UniversityInformation System 31-05-2022 - 27-07-2022- Interested in Data Science")
    )
    
})