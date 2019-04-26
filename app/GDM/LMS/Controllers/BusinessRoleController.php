<?php
/**
 * Created by PhpStorm.
 * User: kartik
 * Date: 2019-04-21
 * Time: 14:06
 */

namespace GDM\LMS\Controllers {

    use Exception;
    use GDM\LMS\Models\BusinessRole;
    use SilverStripe\Control\Controller;
    use SilverStripe\Control\HTTPRequest;
    use SilverStripe\Control\HTTPResponse;
    use SilverStripe\ORM\ValidationException;


    /**
     * Class BusinessRoleController
     * @package GDM\LMS\Controllers
     */
    class BusinessRoleController extends Controller
    {
        private static $allowed_actions = [
            'Save',
            'GetAll',
            'Delete',
        ];

        private static $url_handlers = [
            'save'       => 'Save',
            'get'        => 'GetAll',
            'delete/$ID' => 'Delete'
        ];


        /**
         * @param HTTPRequest $request
         * @return HTTPResponse
         * @throws ValidationException
         */
        public function Save(HTTPRequest $request)
        {
            $response = [
                'success' => false,
                'message' => 'An error occurred'
            ];
            if ($request) {
                $object   = json_decode($request->getBody());
                $isUpdate = isset($object->ID) && $object->ID;
                $model    = $isUpdate ? BusinessRole::get()->byID($object->ID) : BusinessRole::create();
                $model->update((array)$object);
                try {
                    $model->write();
                    $response = [
                        'success' => true,
                        'message' => ($isUpdate ? 'Updated' : 'Added') . ' ok'
                    ];
                } catch (Exception $e) {
                    $response = [
                        'success' => false,
                        'message' => $e->getMessage()
                    ];
                }
            }
            return $this->getResponse()
                        ->addHeader('Content-Type', 'ç')
                        ->setBody(json_encode($response));
        }

        /**
         * @return HTTPResponse|string
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
         * @return HTTPResponse
         */
        public function Delete(HTTPRequest $request)
        {
            $response = [
                'success' => false,
                'message' => 'An error occurred'
            ];

            $id   = $request->param('ID');
            $role = BusinessRole::get()->byID($id);
            if ($role && $role->ID > 0) {
                try {

                    $role->delete();
                    $response = [
                        'success' => true,
                        'message' => 'successfully deleted'
                    ];
                } catch (Exception $e) {
                    $response = [
                        'success' => false,
                        'message' => $e->getMessage()
                    ];
                }
            }

            return $this->getResponse()
                        ->addHeader('Content-Type', 'application/json')
                        ->setBody(json_encode($response));
        }
    }
}
