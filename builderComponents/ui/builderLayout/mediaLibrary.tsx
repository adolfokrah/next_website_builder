'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/builderComponents/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/builderComponents/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../button';
import { useEdgeStore } from '@/lib/edgestore';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/builderComponents/ui/progress';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BoxIcon, FilesIcon, Loader2, Trash2Icon } from 'lucide-react';
import { ImageT } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/builderComponents/ui/alert-dialog';
import { deleteFileDetails, getAllFilesDetails, saveFileDetails } from '@/lib/actions/filesActions';

type MediaLibraryProps = {
  open: boolean;
  selectedImageUrl: string | undefined;
  setOpen: (open: boolean) => void;
  onChange: (image: ImageT) => void;
};

type FileState = {
  id: string;
  file?: File;
  width: number;
  height: number;
  progress: number;
  selected: boolean;
  url?: string;
  status?: 'UPLOADING' | 'COMPLETED';
};

type ImageDimensions = {
  width: number;
  height: number;
};
const MediaLibrary = ({ open, setOpen, onChange, selectedImageUrl }: MediaLibraryProps) => {
  const { edgestore } = useEdgeStore();
  const [currentTab, setCurrentTab] = useState<'upload' | 'media'>('upload');
  const [filesState, setFilesState] = useState<FileState[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE) || 250 * 1024 * 1024;

  const getImageDimensions = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setCurrentTab('media');
    uploadFile(acceptedFiles);
  }, []);

  const uploadFile = async (acceptedFiles: File[]) => {
    let filesData = await Promise.all(
      acceptedFiles.map(async (file) => {
        const dimensions = await getImageDimensions(file);
        return {
          file: file,
          width: dimensions.width,
          height: dimensions.height,
          progress: 0,
          id: uuidv4(),
          selected: false,
        };
      }),
    );
    setFilesState((prevState) => [...filesData, ...prevState]);
    await Promise.all(
      filesData.map(async (fileState) => {
        try {
          const res = await edgestore.publicFiles.upload({
            file: fileState.file,
            onProgressChange: (progress) => {
              setFilesState((prevState) => {
                let newFilesSate = structuredClone(prevState);
                const foundFile = newFilesSate.find((file) => file.id == fileState.id);
                if (foundFile) {
                  foundFile.progress = progress;
                  foundFile.status = 'UPLOADING';
                }
                return [...newFilesSate];
              });
            },
          });

          let data = await saveFileDetails({ url: res.url, width: fileState.width, height: fileState.height });

          setFilesState((prevState) => {
            let newFilesSate = structuredClone(prevState);
            const foundFile = newFilesSate.find((file) => file.id == fileState.id);
            if (foundFile) {
              foundFile.url = res.url;
              foundFile.status = 'COMPLETED';
              foundFile.id = data.data?.id || foundFile.id;
            }
            return [...newFilesSate];
          });
        } catch (e) {
          throw 'An error occurred';
        }
      }),
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    disabled: fetchingFiles,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/svg+xml': [],
    },
  });

  const selectedFile = filesState.find((fileState) => fileState.selected);

  const deleteMedia = async () => {
    try {
      setDeleting(true);
      await edgestore.publicFiles.delete({
        url: selectedFile?.url || '',
      });

      await deleteFileDetails({ id: selectedFile?.id || '' });
      setFilesState((prevState) => {
        return [...prevState].filter((fileState) => fileState.id != selectedFile?.id);
      });
    } catch (e) {
      throw 'An error occurred';
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  useEffect(() => {
    setCurrentTab('upload');
  }, [open]);

  const fetchAllFiles = async () => {
    try {
      setFetchingFiles(true);
      let res = await getAllFilesDetails();
      let data: FileState[] = [
        ...res.data.map((file) => ({ ...file, selected: file.url === selectedImageUrl, progress: 0 })),
      ];
      setFilesState([...data]);
    } catch (e) {
      throw 'An error occurred';
    } finally {
      setFetchingFiles(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] lg:max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue="upload" value={currentTab} className="w-full">
            <TabsList>
              <TabsTrigger value="upload" onClick={() => setCurrentTab('upload')}>
                Upload
              </TabsTrigger>
              <TabsTrigger value="media" onClick={() => setCurrentTab('media')}>
                Media Library
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="h-[500px] w-full">
                <div {...getRootProps()} className="w-full h-full grid place-items-center text-center">
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div>
                      <p className="text-center ">Drag and drop some files here</p>
                      <div className="py-2">
                        <p className="text-xs">or</p>
                      </div>
                      <Button>Click to select files</Button>
                      <p className="text-xs text-slate-400 mt-4">Maximum upload file size: 250MB</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="media">
              <div className="h-[500px] overflow-y-auto">
                <div
                  className={cn('grid place-items-center h-auto w-full text-center', {
                    'h-full': !filesState.length,
                  })}
                >
                  {fetchingFiles && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {!filesState.length && (
                    <div>
                      <BoxIcon size={40} className="m-auto text-slate-500 mb-2" />{' '}
                      <p className="text-slate-800 text-sm">You have no images in your media library</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 w-full justify-start">
                  {filesState.map((fileState) => (
                    <div
                      key={fileState.id}
                      className={cn(
                        'border  cursor-pointer relative hover:border-brand-green-100 transition-colors duration-100 ease-linear border-slate-200 h-[120px] bg-white w-[120px] flex-shrink-0',
                        {
                          'border-brand-green-100': fileState.selected,
                        },
                      )}
                      onClick={() => {
                        setFilesState((prevState) => {
                          let newFilesSate = structuredClone(prevState);
                          return (newFilesSate = newFilesSate.map((file) => ({
                            ...file,
                            selected: file.id === fileState.id,
                          })));
                        });
                      }}
                    >
                      {fileState.status == 'UPLOADING' && (
                        <div className="px-4 relative z-20 w-full h-full grid place-items-center">
                          <Progress value={fileState.progress} />
                        </div>
                      )}

                      {fileState.url && (
                        <Image
                          src={fileState?.url || ''}
                          sizes="100%"
                          alt="no-alt"
                          fill
                          className="absolute w-full h-full object-contain"
                        />
                      )}

                      {fileState.selected && (
                        <div className="absolute bottom-0 right-[-1px]">
                          <svg
                            width="50"
                            height="38"
                            viewBox="0 0 50 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0.5 38L49.5 0.5V38H0.5Z" fill="#099895" />
                            <g clipPath="url(#clip0_211_3630)">
                              <path
                                d="M36.0007 33.6667C39.6827 33.6667 42.6673 30.682 42.6673 27C42.6673 23.318 39.6827 20.3333 36.0007 20.3333C32.3187 20.3333 29.334 23.318 29.334 27C29.334 30.682 32.3187 33.6667 36.0007 33.6667Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M34 27L35.3333 28.3333L38 25.6667"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_211_3630">
                                <rect width="16" height="16" fill="white" transform="translate(28 19)" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedFile && (
                <div className="flex justify-between pt-6  w-full  items-center border-t border-slate-200">
                  <div className="flex gap-2">
                    <div className="relative w-[50px] h-[50px] flex-shrink-0 border border-brand-green-100">
                      <Image
                        src={selectedFile?.url || ''}
                        sizes="100%"
                        alt="no-alt"
                        fill
                        className="absolute w-full h-full object-contain"
                      />
                    </div>
                    <div className="max-w-[300px] ">
                      <p className="truncate">{selectedFile.url}</p>
                      <p className="text-sm text-slate-600 ">
                        {selectedFile.width} x {selectedFile.height}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild disabled={!selectedFile}>
                        <Button variant={'destructive'} disabled={deleting}>
                          {deleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon size={17} className="mr-2" />
                          )}
                          {deleting ? 'Deleting..' : 'Delete Media'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all instances of the media used
                            in the entire website.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={deleteMedia}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      disabled={selectedFile.status === 'UPLOADING'}
                      onClick={() => {
                        onChange({
                          url: selectedFile?.url || '',
                          width: selectedFile.width,
                          height: selectedFile.height,
                          alt: '',
                        });
                        setOpen(false);
                      }}
                    >
                      Insert Media
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
