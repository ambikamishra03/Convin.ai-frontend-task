import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import BucketSelector from "./components/BucketSelector";
import Button from "./components/Button";
import Card from "./components/Card";
import CardContainer from "./components/CardContainer";
import CardForm from "./components/CardForm";
import CreateBucket from "./components/CreateBucket";
import History from "./components/History";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import MultiSelectOverlay from "./components/MultiSelectOverlay";
import { addCard, moveCards, removeCards } from "./store/actions/cardAction";
import { fetchAllBuckets } from "./store/actions/bucketAction";
import { DeleteModal } from "./components/DeleteModal";
import { MoveModal } from "./components/MoveModal";

function App({
  cards = [],
  state,
  bucket,
  addCard,
  moveCards,
  removeCards,
  fetchAllBuckets,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [multiSelectOverlay, setMultiSelectOverlay] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [multiMoveModal, setMultiMoveModal] = useState(false);
  const [multiDeleteModal, setMultiDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});

  console.log({ state });

  const handleItemSelect = (item) => {
    setItemSelected({ ...itemSelected, [item]: !itemSelected[item] });
  };

  const multiSelectOverlayClose = () => {
    setMultiSelectOverlay(!multiSelectOverlay);
    setItemSelected({});
  };

  const handleMultiDelete = () => {
    removeCards(itemSelected);
    setItemSelected({});
  };

  const handleMultiMove = () => {
    moveCards(itemSelected);
    setItemSelected({});
  };

  useEffect(() => fetchAllBuckets(), []);

  return (
    <div className="relative bg-blue-50">
      <CreateBucket />
      <Modal open={formOpen} setOpen={() => setFormOpen(false)}>
        <Dialog.Title
          as="h3"
          className="text-xl text-center px-8 pt-6 font-medium leading-6 text-gray-900"
        >
          Create Card
        </Dialog.Title>
        <CardForm setFormData={setFormData} />
        <div className="px-4 md:px-6 py-3 md:py-4 gap-4 bg-gray-200 flex flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-32 justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-[3px] focus:ring-blue-300"
            onClick={() => setFormOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="inline-flex w-28 justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-[3px] focus:ring-blue-300"
            onClick={() => {
              addCard(bucket.name, {
                ...formData,
                url: "https://www.youtube.com/embed/ud8QZIdBxPw",
              });
              setFormOpen(false);
              setFormData({});
            }}
          >
            Save
          </button>
        </div>
      </Modal>
      <MultiSelectOverlay
        itemSelected={itemSelected}
        multiSelectOverlay={multiSelectOverlay}
        setMultiDeleteModal={setMultiDeleteModal}
        setMultiMoveModal={setMultiMoveModal}
        multiSelectOverlayClose={multiSelectOverlayClose}
      />
      <MoveModal
        moveModalOpen={multiMoveModal}
        setMoveModalOpen={setMultiMoveModal}
        handleMultiMove={handleMultiMove}
      />
      <DeleteModal
        deleteModalOpen={multiDeleteModal}
        setDeleteModalOpen={setMultiDeleteModal}
        handleDelete={handleMultiDelete}
      />

      <div
        id="main"
        className="min-h-screen py-8 px-4 md:px-12 bg-gray-50 pb-16"
      >
        <h2 className="my-10 mx-auto text-center text-3xl font-semibold md:text-4xl">
          Choose bucket
        </h2>
        <BucketSelector />
        <div className="w-full flex justify-center gap-3">
          <Button
            className="w-full md:w-fit py-3 md:px-8 bg-blue-500 flex gap-2 items-center justify-center hover:bg-blue-600 text-white"
            onClick={() => setFormOpen(true)}
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
            </svg>
            Add Card
          </Button>
          <Button
            className="w-full md:w-fit py-3 md:px-8 bg-green-500 flex gap-2 items-center justify-center hover:bg-green-600 text-white"
            onClick={() => setMultiSelectOverlay(!multiSelectOverlay)}
          >
            Select Multiple
          </Button>
        </div>
        <hr className="mb-8 mt-4" />
        <CardContainer>
          {cards.map((card, index) => (
            <Card
              key={index}
              multiSelect={multiSelectOverlay}
              url={card?.url}
              id={card.id}
              title={card.title}
              content={card.content}
              onItemSelect={() => handleItemSelect(card.id)}
              isSelected={itemSelected[card.id]}
            />
          ))}
        </CardContainer>
      </div>
      <History />
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state,
    cards: state.card.cards,
    bucket: state.bucket.selected,
  };
};

export default connect(mapStateToProps, {
  addCard,
  moveCards,
  removeCards,
  fetchAllBuckets,
})(App);