// 'use client';
// import { BlockPropsTypes, SideBarProps } from '@/lib/types';
// import { Button } from '../button';
// import { ArrowLeftIcon } from '@radix-ui/react-icons';
// import { Draggable, Droppable } from 'react-beautiful-dnd';
// import { cn } from '@/lib/utils';

// import RenderComponentController from './blocksControllers/renderBlocksController';

// const SideBar = ({
//   registeredComponents,
//   handleAddComponent,
//   selectedComponent,
//   handleRemoveSelectedComponent,
//   handlePropValueChange,
// }: SideBarProps) => {
//   return (
//     <div className="h-screen z-30 fixed w-[300px] left-0 border-r bg-white border-r-slate-200 p-3">
//       {selectedComponent ? (
//         <>
//           <Button variant={'outline'} onClick={handleRemoveSelectedComponent}>
//             <ArrowLeftIcon />
//           </Button>

//           {selectedComponent.props &&
//             selectedComponent.props.map((prop, index) => {
//               let defaultValue = selectedComponent.inputs ? selectedComponent.inputs[prop.name] : '';

//               return (
//                 <div key={`${selectedComponent.id}_${prop.name}`} className="mb-2">
//                   <RenderComponentController
//                     prop={prop}
//                     propIndex={index}
//                     defaultValue={defaultValue}
//                     handlePropValueChange={handlePropValueChange}
//                   />
//                 </div>
//               );
//             })}
//         </>
//       ) : (
//         <>
//           <h5>Components</h5>
//           <Droppable droppableId={'sidebar'} isDropDisabled={true}>
//             {(provided, snapshot): JSX.Element => (
//               <div className="h-full overflow-auto " ref={provided.innerRef} {...provided.droppableProps}>
//                 <div className="grid  grid-cols-2 gap-2">
//                   {registeredComponents.map((component, index) => (
//                     <Draggable
//                       key={`${component.title}${index}`}
//                       draggableId={component.title.replace(/ /g, '_')}
//                       index={index}
//                     >
//                       {(provided, snapshot) => (
//                         <>
//                           <div
//                             className={cn(
//                               'grid place-items-center  py-2  hover:bg-slate-50 transition-all duration-200 border border-slate-200 rounded-sm bg-white',
//                               {
//                                 'opacity-50': snapshot.isDragging,
//                               },
//                             )}
//                             onClick={() => handleAddComponent(component)}
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               ...(snapshot.isDragging ? provided.draggableProps.style : {}),
//                             }}
//                           >
//                             <div className="item-center">
//                               <div className="flex justify-center p-3">{component.icon}</div>
//                               <span className=" text-sm">{component.title}</span>
//                             </div>
//                           </div>

//                           {snapshot.isDragging && (
//                             <div
//                               className={cn(
//                                 'grid place-items-center  py-2  hover:bg-slate-50 transition-all duration-200 border border-slate-200 rounded-sm bg-white',
//                               )}
//                             >
//                               <div className="item-center">
//                                 <div className="flex justify-center p-3">{component.icon}</div>
//                                 <span className=" text-sm">{component.title}</span>
//                               </div>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </Draggable>
//                   ))}
//                 </div>
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </>
//       )}
//     </div>
//   );
// };

// export default SideBar;
