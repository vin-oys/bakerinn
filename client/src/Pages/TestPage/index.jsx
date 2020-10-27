// import React, { Component } from 'react'
// import { ReactComponent as ReactLogo } from '../../arrow.svg';
// import { Image } from 'cloudinary-react'

// export default class Test extends Component {
//     constructor() {
//         super()
//         this.state = {
//             message: ""
//         }

//     }
//     componentDidMount() {
//         fetch('/api')
//             .then(res => res.text())
//             .then(res => this.setState({
//                 message: res
//             }))
//             .catch(err => console.log(err))
//     }

//     render() {
//         return (
//             <div>
//                 <div style={{ width: "200px" }}>
//                     <div style={{
//                         height: "50px",
//                         width: "50px",
//                         backgroundColor: "black",
//                         backgroundImage: "url(http://res.cloudinary.com/dk0bjhiu9/image/upload/v1/project_3/c93co1o7uwl9f6xyhycl)"
//                     }}></div>
//                     <Image className="w-100" cloudName="dk0bjhiu9" publicId="project_3/c93co1o7uwl9f6xyhycl" />
//                     <ReactLogo transform='rotate(-90)' />
//                 </div>
//             </div>
//         )
//     }
// }
