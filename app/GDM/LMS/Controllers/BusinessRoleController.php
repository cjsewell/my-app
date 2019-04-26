<?php
/**
 * Created by PhpStorm.
 * User: kartik
 * Date: 2019-04-21
 * Time: 14:06
 */

namespace GDM\LMS\Controllers {

    use GDM\LMS\Models\BusinessRole;
    use SilverStripe\Control\Controller;
    use SilverStripe\Control\HTTPRequest;


    /**
     * Class BusinessRoleController
     * @package GDM\LMS\Controllers
     */
    class BusinessRoleController extends Controller
    {
        private static $allowed_actions = [
            'Add',
            'GetAll',
            'Delete',
            'Update'
        ];

        private static $url_handlers = [
            'add' => 'Add',
            'get' => 'GetAll',
            'delete/$ID' => 'Delete',
            'edit/$ID' => 'Update'
        ];


        /**
         * @param HTTPRequest $request
         * @return \SilverStripe\Control\HTTPResponse
         * @throws \SilverStripe\ORM\ValidationException
         */
        public function Add(HTTPRequest $request)
        {
            $response = [
                "success" => false,
                "message" => "An error occurred"
            ];
            if ($request) {
                $object = json_decode($request->getBody());
                $model = BusinessRole::create();
                $model->Name = $object->name;
                $model->write();
                $response = [
                    "success" => true,
                    "message" => "Added ok"
                ];
            }
            return $this->getResponse()
                ->addHeader('Content-Type', 'ç')
                ->setBody(json_encode($response));
        }


        /**
         * @param HTTPRequest $request
         * @return \SilverStripe\Control\HTTPResponse
         * @throws \SilverStripe\ORM\ValidationException
         */
        public function Update(HTTPRequest $request)
        {
            $response = [
                "success" => false,
                "message" => "An error occurred"
            ];

            if($request) {
                $id = $request->param('ID');
                $object = json_decode($request->getBody());
                $model = $id ? BusinessRole::get()->byID($id) : BusinessRole::create();
                $model->Name = $object->name;
                $model->write();
                $response = [
                    "success" => true,
                    "message" => "Updated ok"
                ];
            }

            return $this->getResponse()
                ->addHeader('Content-Type', 'application/json')
                ->setBody(json_encode($response));
        }


        /**
         * @return \SilverStripe\Control\HTTPResponse|string
         *
         * Gets all business roles in the database
         */
        public function GetAll()
        {
            return $this->getResponse()
                ->addHeader('Content-Type', 'application/json')
                ->setBody(json_encode(BusinessRole::get()->toNestedArray()));
        }


        /**
         * @param HTTPRequest $request
         * @return \SilverStripe\Control\HTTPResponse
         */
        public function Delete(HTTPRequest $request)
        {
            $response = [
                "sucesses" => false,
                "message" => "An error occured"
            ];

            $id = $request->param('ID');
            $role = BusinessRole::get()->byID($id);
            if ($role && $role->ID > 0) {
                $role->delete();
                $response = [
                    'success' => true,
                    'message' => 'successfully deleted'
                ];
            }

            return $this->getResponse()
                ->addHeader('Content-Type', 'application/json')
                ->setBody(json_encode($response));
        }
    }
}