import React from "react";

const Links = () => {
  return (
    <>
      <div className="space-y-5">
        <h3 className="tracking-wide uppercase text-white font-semibold">
          Product
        </h3>
        <ul className="space-y-3">
          <li>
            <a rel="noopener noreferrer" href="#">
              About
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Contact Us
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Support
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Careers
            </a>
          </li>
        </ul>
      </div>
      <div className="space-y-5">
        <h3 className="tracking-wide uppercase text-white font-semibold">
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li>
            <a rel="noopener noreferrer" href="#">
              Share Location
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Orders Tracking
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Size Guide
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              FAQs
            </a>
          </li>
        </ul>
      </div>
      <div className="space-y-5">
        <h3 className="tracking-wide uppercase text-white font-semibold">
          Legal
        </h3>
        <ul className="space-y-3">
          <li>
            <a rel="noopener noreferrer" href="#">
              Terms & conditions
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Links;
