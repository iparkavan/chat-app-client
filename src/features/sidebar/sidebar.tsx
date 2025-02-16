import React from "react";
import ProfileInfo from "./profile-info";

const Sidebar = () => {
  return (
    <div className="p-2 min-w-16">
      <div className="">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default Sidebar;

// ------------------------------------------------------------

// 'use client';

// import { ChevronRightIcon } from '@radix-ui/react-icons';
// import React, { useState } from 'react';

// type TreeNodeProps = {
//   node: TreeNodeType;
// };

// type TreeNodeType = {
//   title: string;
//   children?: TreeNodeType[];
// };

// const data: TreeNodeType[] = [
//   {
//     title: 'Parent 1',
//     children: [
//       { title: 'Child 1-1' },
//       { title: 'Child 1-2', children: [{ title: 'Subchild 1-2-1' }] },
//     ],
//   },
//   {
//     title: 'Parent 2',
//     children: [{ title: 'Child 2-1' }, { title: 'Child 2-2' }],
//   },
// ];

// const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const hasChildren = node.children ? true : false;

//   return (
//     <div className="mx-2">
//       <div
//         className="flex items-center justify-between p-2 cursor-pointer hover:bg-primary-foreground dark:hover:bg-primary-foreground rounded-md transition-colors duration-300"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-sm">{node.title}</span>
//         {hasChildren && (
//           <span
//             className={`mr-2 transform transition-transform duration-300 ${
//               isOpen ? 'rotate-90' : ''
//             }`}
//           >
//             <ChevronRightIcon />
//           </span>
//         )}
//       </div>
//       {hasChildren && (
//         <div
//           className={`overflow-hidden transition-all duration-300 ${
//             isOpen ? 'max-h-screen' : 'max-h-0'
//           }`}
//         >
//           {node.children?.map((childNode, index) => (
//             <TreeNode key={index} node={childNode} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const Sidebar: React.FC = () => {
//   return (
//     <div>
//       <div className="p-4 font-bold">Sidebar Treeview</div>
//       <div>
//         {data.map((node, index) => (
//           <TreeNode key={index} node={node} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
