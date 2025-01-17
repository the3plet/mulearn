import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BsPersonAdd } from "react-icons/bs";
import { LuCopy, LuEdit } from "react-icons/lu";
import { MdOutlineUnpublished, MdPublishedWithChanges } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

import Modal from "@/MuLearnComponents/Modal/Modal";

import {
    deleteHackathon,
    getHackathons,
    publishHackathon
} from "../services/HackathonApis";

import { HackList } from "../services/HackathonInterfaces";

import styles from "../pages/HackathonCreate.module.css";
import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";

enum ModalType {
    Publish,
    Delete
}

type Props = {
    hackathon: HackList;
    index: number;
    ownData: HackList[];
    setOwnData: React.Dispatch<React.SetStateAction<HackList[]>>;
    setData: React.Dispatch<React.SetStateAction<HackList[]>>;
};

const HackathonCardIconButtons = ({
    hackathon,
    index,
    ownData,
    setOwnData,
    setData
}: Props) => {
    const navigate = useNavigate();
    const toast = useToast();

    const shareData = {
        title: hackathon.title,
        url: `${import.meta.env.VITE_FRONTEND_URL}/dashboard/hackathon/details/${hackathon.id}`
    };
    const isShareable =  window.navigator.canShare && window.navigator.canShare(shareData)

    const [isPublishOpen, setIsPublishOpen] = useState<boolean[]>(
        ownData.map(() => false)
    );

    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean[]>(
        ownData.map(() => false)
    );

    const toggleModal = (index: number, type: string) => {
        if (type == ModalType[0]) {
            setIsPublishOpen(prevState => {
                const newState = [...prevState];
                newState[index] = !newState[index];
                return newState;
            });
        } else {
            setIsDeleteOpen(prevState => {
                const newState = [...prevState];
                newState[index] = !newState[index];
                return newState;
            });
        }
    };

    function isDetailsComplete(): boolean {
        if (
            hackathon.id &&
            hackathon.title &&
            hackathon.type &&
            hackathon.tagline &&
            hackathon.event_logo &&
            hackathon.banner &&
            hackathon.website &&
            hackathon.place &&
            hackathon.event_start &&
            hackathon.event_end &&
            hackathon.application_start &&
            hackathon.application_ends &&
            hackathon.description &&
            hackathon.participant_count !== null &&
            hackathon.district &&
            hackathon.organisation &&
            hackathon.district_id &&
            hackathon.org_id !== null &&
            hackathon.editable !== null
        ) {
            return true;
        }
        return false;
    }

    const isDraft = hackathon.status === "Draft";

    return (
        <div className={styles.shared}>
            {hackathon.editable ? (
                <div className={styles.shared2}>
                    <div className={styles.frame2}>
                        <div>
                            <div className={styles.group}>
                                <Link
                                    to={`/dashboard/hackathon/edit/${hackathon.id}`}
                                >
                                    <LuEdit
                                        data-tooltip-id="Icon"
                                        data-tooltip-content="Edit"
                                    />
                                </Link>
                            </div>
                            <div className={styles.group}>
                                <Link
                                    to={`/dashboard/hackathon/organizers/${hackathon.id}`}
                                >
                                    <BsPersonAdd
                                        data-tooltip-id="Icon"
                                        data-tooltip-content="Add Organizer"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div>
                            <div className={styles.group}>
                                <RiDeleteBin5Line
                                    data-tooltip-id="Icon"
                                    data-tooltip-content="Delete"
                                    onClick={() => {
                                        toggleModal(index, ModalType[1]);
                                    }}
                                />
                                {isDeleteOpen[index] && (
                                    <Modal
                                        setIsOpen={() =>
                                            toggleModal(index, ModalType[1])
                                        }
                                        id={hackathon.id}
                                        heading={"Delete"}
                                        content={`Are you sure you want to delete ${hackathon.title} ?`}
                                        click={() => {
                                            deleteHackathon(
                                                hackathon.id,
                                                toast
                                            );
                                            setTimeout(() => {
                                                getHackathons(setOwnData);
                                                getHackathons(setData);
                                            }, 1000);
                                            setTimeout(() => {
                                                navigate(
                                                    "/dashboard/hackathon"
                                                );
                                            }, 1000);
                                        }}
                                    />
                                )}
                            </div>
                            {!isDraft && (
                                <>
                                    <div className={styles.group}>
                                        <MdOutlineUnpublished
                                            data-tooltip-id="Icon"
                                            data-tooltip-content="Change to Draft"
                                            onClick={() => {
                                                toggleModal(
                                                    index,
                                                    ModalType[0]
                                                );

                                            }}
                                        />
                                    </div>
                                    {isPublishOpen[index] && (
                                        <Modal
                                            setIsOpen={() =>
                                                toggleModal(index, ModalType[0])
                                            }
                                            id={hackathon.id}
                                            heading="Draft"
                                            content={`Are you sure you want to set ${hackathon.title} to Draft`}
                                            click={() => {
                                                publishHackathon(
                                                    hackathon.id,
                                                    hackathon.status,
                                                    toast
                                                );
                                                setTimeout(() => {
                                                    getHackathons(setOwnData);
                                                    getHackathons(setData);
                                                }, 1000);
                                                setTimeout(() => {
                                                    navigate(
                                                        "/dashboard/hackathon"
                                                    );
                                                }, 2000);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {!isDraft && (
                        <PowerfulButton                        
                            children="List"
                            data-tooltip-content="List Participants"
                            onClick={() => {
                                navigate(
                                    `/dashboard/hackathon/applicants/${hackathon.id}`
                                );
                            }}
                        />
                    )}
                </div>
            ) : (
                <div className={styles.frame2}>
                    <div
                        className={styles.group}
                        onClick={() => {
                                window.navigator.clipboard.writeText( shareData.url );
                                toast({
                                    title: "Success",
                                    description: "Link copied to clipboard",
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true
                                });
                                if (isShareable) window.navigator.share(shareData);
                        }}
                    >
                        <LuCopy
                            data-tooltip-id="Icon"
                            data-tooltip-content={`Copy${ isShareable ? "/Share" : ""}`}
                         />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackathonCardIconButtons;
