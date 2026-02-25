import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`;

const Box = styled.div`
  height: ${(p) => p.h || "20px"};
  width: ${(p) => p.w || "100%"};
  border-radius: 6px;
  margin-bottom: 10px;
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #f5f5f5 80px,
    #e0e0e0 160px
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.3s infinite;
`;

const Card = styled.div`
  background: white;
  padding: 16px;
  border-radius: 10px;
`;

export default function SkeletonCard() {
  return (
    <Card>
      <Box h="140px" />
      <Box />
      <Box w="60%" />
    </Card>
  );
}
