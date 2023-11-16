'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction } from 'react';
import { Input } from '../input';
import { Button } from '../button';

type alertStatusAction = 'insertGlobal' | 'removeGlobal';
const AddRemoveBlockAlert = ({
  alertStatus,
  setAlertStatus,
  handleRemoveGlobalBlock,
  globalBlockInputName,
  setGlobalBlockInputName,
  handleSaveGlobalBlock,
}: {
  alertStatus: {
    open: boolean;
    action: alertStatusAction;
    value?: number | string | undefined;
  };
  setAlertStatus: (status: boolean) => void;
  handleRemoveGlobalBlock: (status: string) => void;
  globalBlockInputName: string;
  setGlobalBlockInputName: (name: string) => void;
  handleSaveGlobalBlock: (index: number) => void;
}) => {
  return (
    <AlertDialog open={alertStatus.open} onOpenChange={(open) => setAlertStatus(open)}>
      <AlertDialogContent>
        {alertStatus.action === 'removeGlobal' ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently de-register all instances of this block as global
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleRemoveGlobalBlock(alertStatus.value as string)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Save this block as global</AlertDialogTitle>
              <AlertDialogDescription>
                This action will make the block accessible and usable across all pages.
              </AlertDialogDescription>
              <div className="mt-2">
                <label className=" text-xs font-semibold">Name</label>
                <Input
                  className="mb-3 mt-1 w-full"
                  onChange={(e) => {
                    setGlobalBlockInputName(e.target.value);
                  }}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                disabled={!globalBlockInputName.length}
                onClick={() => {
                  handleSaveGlobalBlock(alertStatus.value as number);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddRemoveBlockAlert;
