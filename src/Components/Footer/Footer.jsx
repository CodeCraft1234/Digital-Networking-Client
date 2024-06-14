import { useEffect, useState } from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import useLogo from "../../Hook/useLogo";
import useLinks from "../../Hook/useLinks";

const Footer = () => {

  const [logo, setLogo] = useLogo();
  const [latestLogo, setLatestLogo] = useState(null);
  console.log(latestLogo, logo);

  useEffect(() => {
    if (logo && logo.length > 0) {
      // Sort the logos based on date in descending order
      const sortedLogo = [...logo].sort((a, b) => new Date(b.date) - new Date(a.date));

      // Get the latest logo
      const latest = sortedLogo[0];

      // Set the sorted logo and latest logo state
      setLogo(sortedLogo);
      setLatestLogo(latest);
    }
  }, [logo, setLogo]);

  const [links, setLinks] = useLinks();
  const [latestLinks, setLatestLinks] = useState(null);
  
  useEffect(() => {
    if (links && links.length > 0) {
      // Sort the links based on date in descending order
      const sortedLinks = [...links].sort((a, b) => new Date(b.date) - new Date(a.date));
  
      // Get the latest link
      const latest = sortedLinks[0];
  
      // Update state with sorted links and latest link
      setLinks(sortedLinks);
      setLatestLinks(latest);
    }
  }, [links, setLinks]);
  return (
    <div>
      <footer className="px-4 divide-y font-bold bg-gray-300 text-black">
        <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="lg:w-1/3">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex justify-center space-x-3 lg:justify-start"
            >
              <div className="flex justify-center items-center mx-auto">
                <img
                  className="h-24 w-24 p-1 "
                  src={latestLogo?.photo}
                  alt=""
                />
              </div>
            </a>
          </div>
          <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="tracki uppercase ">Services</h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Digital Marketing
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Graphics Design
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Web Design
                  </a>
                </li>
                {/* <li>
                  <a rel="noopener noreferrer" href="#">
                    Landing Page Design
                  </a>
                </li> */}
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Web Development
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="tracki uppercase ">Interest</h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Next.js
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="uppercase ">Skills</h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    MongoDB
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    React.js
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Node.js
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Express.js
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Java script
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Html 5
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="uppercase  font-bold">
                Social media
              </div>
              <div className="flex text-2xl justify-start space-x-3">
  {latestLinks?.facebookID && (
    <a href={latestLinks.facebookID} target="_blank" rel="noopener noreferrer">
      <FaFacebookSquare />
    </a>
  )}

  {latestLinks?.instagramID && (
    <a href={latestLinks.instagramID} target="_blank" rel="noopener noreferrer">
      <FaInstagramSquare />
    </a>
  )}

  {latestLinks?.twitterID && (
    <a href={latestLinks.twitterID} target="_blank" rel="noopener noreferrer">
      <FaTwitter size={24} />
    </a>
  )}

  {latestLinks?.whatsappID && (
    <a href={latestLinks.whatsappID} target="_blank" rel="noopener noreferrer">
      <FaWhatsapp size={24} />
    </a>
  )}

  {latestLinks?.youtubeID && (
    <a href={latestLinks.youtubeID} target="_blank" rel="noopener noreferrer">
      <FaYoutube size={24} />
    </a>
  )}
</div>

            </div>
          </div>
        </div>
        <div className="py-6 text-sm text-center dark:text-gray-400">
          2023 © All rights reserved By Digital Network
        </div>
      </footer>
    </div>
  );
};

export default Footer;
